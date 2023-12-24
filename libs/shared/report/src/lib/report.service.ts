import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IReport, ResponseInterface } from '@mwazi/shared/data-models';
import { Observable } from 'rxjs';
import { fDate } from './format-time';
import JsPDF from 'jspdf';
import { toAbsoluteUrl } from './asset-helpers';
import { trimStr } from './string.helpers';
import { fReportCurrency } from './number.helper';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) {
  }

  getItemBy(value: string | number, by = 'id'): Observable<ResponseInterface<IReport>> {
    return this.http.get<ResponseInterface<IReport>>(`reports/${value}`)
  }

  downloadCsv = async (report: IReport) => {
    const separator = ', ';
    const header = ["No", "Date", "Details", "Amount (KES)"];
    // set headers
    let content = `${header.join(separator)}\n`;
    // set data
    const _trx = report?.transactions;
    _trx.forEach((row, i) => {
      const _row = [
        `${i + 1}`,
        `${fDate(row.transactionDate, 'dd/MM/yyyy')}`,
        `${(row.senderName ?? '').replace(',', '')}`,
        `${row?.transactionType === 'C' ? '+' : '-'}${row?.transactionAmount}`,
      ];
      content += `${_row.join(separator)}\n`;
    });

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const suffix = (new Date().getTime()).toString(36);
    const filename = `report-${suffix}.csv`;
    setTimeout(() => {
      if ((navigator as any).msSaveBlob) { // In case of IE 10+
        (navigator as any).msSaveBlob(blob, filename);
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          // Browsers that support HTML5 download attribute
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }, 2000);
  };

  trxSummary = (summary: any[], type: any) => {
    let amount = 0;
    const amountObj = summary.find((s) => s.Category === type);
    if (amountObj) amount = amountObj.Total;
    return amount;
  }

  categoryStr = (report: IReport) => {
    let str = 'Other';
    if (report?.category !== 'Other' && report?.category !== 'other') str = report?.category;
    else if ((report?.category === 'Other' || report?.category === 'other') && report?.otherCategory) str = report?.otherCategory;
    return str;
  }

  downloadPdf = async (report: IReport, open = false) => {
    const padding = 30;
    const left = padding;
    // console.log(report);
    const pdf = new JsPDF('portrait', 'px', 'a4');

    pdf.setFont("Nunito-Regular", "normal");

    // identity
    pdf.addImage(toAbsoluteUrl("/assets/images/logo.png"), "PNG", left, 40, 74, 18);
    pdf.setFontSize(12);
    pdf.text("Control your project funds.", left, 70);

    // admin
    pdf.text("Group Administrators:", left, 102);
    pdf.text(`1. ${report?.projectAdmin}`, left, 116);
    pdf.text(`${report?.projectAdminPhone ? report?.projectAdmin : '[Phone number not available]'}`, left, 130);

    // project description
    const description = pdf.splitTextToSize(`${report?.description ? report?.description : '[Project description not available]'}`, 320);
    pdf.text(description, left, 180);

    // category
    const category = `${this.categoryStr(report)}`; // category name
    const badge = { width: (pdf.getTextDimensions(category).w + 20), height: 20, radius: 10, color: '#327454' }
    pdf.setDrawColor(badge.color);
    pdf.setFillColor(236, 241, 238);
    pdf.setLineWidth(1);
    pdf.roundedRect(left, 200, badge.width, badge.height, badge.radius, badge.radius, "FD");
    pdf.setTextColor(badge.color);
    pdf.setFontSize(12);
    pdf.text(category, (left + 10), 213, undefined,  'left');

    // project summary
    const summaryLeft = 220;
    const projectName = pdf.splitTextToSize(trimStr(`${report?.projectName}`, 72), 180);
    pdf.setFont("Nunito-Bold", "normal");
    pdf.setTextColor("#000000");
    pdf.setFontSize(12);
    pdf.text(projectName, summaryLeft, 50);

    pdf.setFontSize(11);
    pdf.setFont("Nunito-Regular", "normal");
    pdf.setTextColor("#344054");
    pdf.addImage(toAbsoluteUrl("/assets/images/report-project-date.png"), "PNG", summaryLeft, 65, 9, 9);
    pdf.text("Project dates:", (summaryLeft + 12), 72);
    pdf.text("Start", (summaryLeft + 80), 72);
    pdf.text("End", (summaryLeft + 80), 84);

    pdf.setTextColor(!report?.isProjectActive ? "#98A2B3" : "#000000");
    pdf.setFont("Nunito-Bold", "normal");
    pdf.text(`${fDate(report?.startDate, 'dd/MM/yyyy')}`, (summaryLeft + 192), 72, undefined, "right"); // start date
    pdf.text(`${fDate(report?.endDate, 'dd/MM/yyyy')}`, (summaryLeft + 192), 84, undefined, "right"); // end date

    pdf.setTextColor("#344054");
    pdf.setFont("Nunito-Regular", "normal");
    pdf.addImage(toAbsoluteUrl("/assets/images/report-target-amount.png"), "PNG", summaryLeft, 95, 9, 9);
    pdf.text("Target amount:", (summaryLeft + 12), 102);
    pdf.setTextColor(!report?.isProjectActive ? "#98A2B3" : "#000000");
    pdf.setFont("Nunito-Bold", "normal");
    pdf.text(`${fReportCurrency(report?.targetAmount)} KES`, (summaryLeft + 192), 102, undefined, "right"); // target amount

    pdf.setTextColor("#344054");
    pdf.setFont("Nunito-Regular", "normal");
    pdf.addImage(toAbsoluteUrl("/assets/images/report-transactions.png"), "PNG", summaryLeft, 110, 9, 9);
    pdf.text("Transactions:", (summaryLeft + 12), 117);
    pdf.text("Collections", (summaryLeft + 80), 117);
    pdf.text("Expenses", (summaryLeft + 80), 129);
    pdf.text("Balance", (summaryLeft + 80), 149);
    pdf.setFont("Nunito-Bold", "normal");
    pdf.setTextColor(!report?.isProjectActive ? "#98A2B3" : "#2F9803");
    pdf.text(`+${fReportCurrency(this.trxSummary(report?.transactionSummary, 'MoneyIn'))} KES`, (summaryLeft + 192), 117, undefined, "right"); // collections
    pdf.setTextColor(report?.isProjectActive ? "#98A2B3" : "#D32F2F");
    pdf.text(`${this.trxSummary(report?.transactionSummary, 'MoneyOut') > 0 ? '-' : ''}${fReportCurrency(this.trxSummary(report?.transactionSummary, 'MoneyOut'))} KES`, (summaryLeft + 192), 129, undefined, "right"); // expenses
    const balance = (this.trxSummary(report?.transactionSummary, 'MoneyIn') - this.trxSummary(report?.transactionSummary, 'MoneyOut'));
    pdf.setTextColor(!report?.isProjectActive ? "#98A2B3" : balance >= 0 ? "#2F9803" : "#D32F2F");
    pdf.text(`${fReportCurrency(balance)} KES`, (summaryLeft + 192), 149, undefined, "right"); // balance
    // summation lines
    pdf.setLineWidth(1);
    pdf.setDrawColor(!report?.isProjectActive ? "#98A2B3" : "#344054");
    pdf.line((summaryLeft + 128), 136, 412, 136);
    pdf.line((summaryLeft + 128), 155, 412, 155);
    pdf.line((summaryLeft + 128), 158, 412, 158);

    // transactions header
    pdf.setFontSize(14);
    pdf.setFont("Nunito-Regular", "normal");
    pdf.setTextColor("#000000");
    pdf.text("Transactions", left, 260, undefined, "left");
    pdf.setLineWidth(1);
    pdf.setDrawColor("#000000");
    pdf.line(left, 266, 420, 266);

    // table header
    pdf.setFontSize(12);
    pdf.setFont("Nunito-Bold", "normal");
    pdf.setTextColor("#000000");
    pdf.text("No", (left + 10), 282, undefined, "left");
    pdf.text("Date", (left + 70), 282, undefined, "left");
    pdf.text("Details", (left + 170), 282, undefined, "left");
    pdf.text("Amount (KES)", (left + 320), 282, undefined, "left");

    const transactions = report?.transactions;

    // table data
    const maxRows = 12;
    const maxRowsFp = 24;
    const _trxs = [];
    _trxs[0] = transactions.slice(0, maxRows);
    let pages = 1;
    if (transactions.length > maxRows) {
      const _tmpTrxs = transactions.slice(maxRows);
      pages = Math.ceil(_tmpTrxs.length / maxRowsFp);
      for (let i = 0; i < pages; i += 1) {
        const start = (i * maxRowsFp);
        const end = (start + maxRowsFp);
        _trxs[(i + 1)] = _tmpTrxs.slice(start, end);
      }
    }
    const timeReportGenerated = new Date().toString();
    let counter = 0;
    _trxs.forEach((_trx, idx) => {
      let dataTop = 302;
      let rowTop = 290;
      if (idx > 0) {
        dataTop = 72;
        rowTop = 60;
        pdf.addPage("a4", "p");
        // add table header
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor("#000000");
        pdf.text("No", (left + 10), 48, undefined, "left");
        pdf.text("Date", (left + 70), 48, undefined, "left");
        pdf.text("Details", (left + 170), 48, undefined, "left");
        pdf.text("Amount (KES)", (left + 320), 48, undefined, "left");
      }
      // generate table background rows
      const rowHeight = 20;
      for (let i = 1; i <= ((idx === 0) ? maxRows : maxRowsFp); i += 1) {
        let fcolor = '#ffffff';
        if ((i % 2) !== 0) fcolor = "#DDEBF7"
        pdf.setFillColor(fcolor);
        pdf.rect(left, rowTop, 390, rowHeight, "F");
        rowTop += rowHeight;
      }
      // generate table data
      const dataHeight = 20;
      _trx.forEach((row, i) => {
        counter += 1;
        pdf.setFontSize(11);
        pdf.setFont("Nunito-Regular", "normal");
        pdf.setTextColor("#000000");
        pdf.text(`${counter}`, (left + 10), dataTop, undefined, "left");
        pdf.text(`${fDate(row.transactionDate, 'dd/MM/yyyy')}`, (left + 70), dataTop, undefined, "left");
        pdf.text(trimStr(`${row.senderName}`, 32), (left + 170), dataTop, undefined, "left");
        pdf.setFont("Nunito-Bold", "normal");
        pdf.setTextColor(!report?.isProjectActive ? "#98A2B3" : row?.transactionType === 'C' ? '#2F9803' : '#D32F2F');
        pdf.text(`${row?.transactionType === 'C' ? '+' : '-'}${fReportCurrency(row?.transactionAmount)}`, (left + 374), dataTop, undefined, "right");
        dataTop += dataHeight;
      });

      // add page footer
      pdf.setFontSize(10);
      pdf.setFont("Nunito-Regular", "normal");
      pdf.setTextColor("#344054");
      // pdf.text("STATEMENT SUMMARY", left, 560,undefined, "left");
      pdf.text(`Generated on: ${timeReportGenerated}`, left, 572, undefined, "left");
      pdf.setFontSize(8);
      pdf.text(`This is a computer generated statement report and does not require signature`, (left + 184), 590, undefined, "center");
      let pagesCount = pages;
      if (transactions.length > maxRows) pagesCount += 1
      pdf.setFontSize(10);
      pdf.text(`Page ${(idx + 1)}/${pagesCount}`, (left + 376), 600, undefined, "right");
    });

    // if (open) window.location.replace(pdf.output('bloburl'));
    // else {
    const suffix = (new Date().getTime()).toString(36);
    setTimeout(() => {
      pdf.save(`report-${suffix}.pdf`);
      // enableDownloadBtn();
    }, 2000);
    // }
  };
}
