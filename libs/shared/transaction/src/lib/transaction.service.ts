import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITransaction, ResponseInterface } from '@mwazi/shared/data-models';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private http: HttpClient) {
  }

  create(data: any) {
    return this.http.post<ResponseInterface<ITransaction>>('transactions', data).pipe(
      map(({responseObject}) => responseObject)
    )
  }

  delete(transactionId: number) {
    return this.http.delete<ResponseInterface<ITransaction>>(`transactions/${transactionId}`).pipe(
      map(({responseObject}) => responseObject)
    )
  }

  getItemBy(value: any, by = 'id') {
    return this.http.get<ResponseInterface<ITransaction>>(`transactions/${value}`).pipe(
      map(({responseObject}) => responseObject),
    )
  }

  update({data, transactionId}: { transactionId: number, data: any }) {
    return this.http.patch<ResponseInterface<ITransaction>>(`transactions/${transactionId}`, data).pipe(
      map(({responseObject}) => responseObject),
    )
  }

  manualMapping(data:any) {
    return this.http.post<ResponseInterface<ITransaction[]>>('manualmapping', {messages: [data]}).pipe(
      map(({responseObject}) => responseObject)
    )
  }
}
