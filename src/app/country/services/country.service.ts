import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-country.interface';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import type { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mapper/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private http = inject(HttpClient);

  searchByCapital(query: string):Observable<Country[]>{

    query=query.toLowerCase();

    return of([]);

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map((resp)=> CountryMapper.mapRestCountryArraytoCountryArray(resp)),
      catchError((error)=>{
        console.log('Error fetching',error);
        return throwError(()=> new Error(`No se pudo obtener pais con ese query: ${query}`)
      );
      })
    );
  }

  searchByCountry(query: string):Observable<Country[]>{

    query=query.toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`).pipe(
      map((resp)=> CountryMapper.mapRestCountryArraytoCountryArray(resp)),
      delay(1500),
      catchError((error)=>{
        console.log('Error fetching',error);
        return throwError(()=> new Error(`No se pudo obtener pais con ese query: ${query}`)
      );
      })
    );
  }

    searchByCountryID(code: string){

      const url= `${API_URL}/alpha/${code}`;

    return this.http.get<RESTCountry[]>(url).pipe(
      map((resp)=> CountryMapper.mapRestCountryArraytoCountryArray(resp)),
      map((countries)=>countries.at(0)),
      catchError((error)=>{
        console.log('Error fetching',error);
        return throwError(()=> new Error(`No se pudo obtener pais con ese code: ${code}`)
      );
      })
    );
  }

}
