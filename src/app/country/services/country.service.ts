import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-country.interface';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import type { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mapper/country.mapper';
import { Region } from '../interfaces/region.type';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<Region, Country[]>();



  searchByCapital(query: string):Observable<Country[]>{

    query=query.toLowerCase();
    if(this.queryCacheCapital.has(query)){
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map((resp)=> CountryMapper.mapRestCountryArraytoCountryArray(resp)),
      tap((countries)=> this.queryCacheCapital.set(query,countries)),
      catchError((error)=>{
        console.log('Error fetching',error);
        return throwError(()=> new Error(`No se pudo obtener pais con ese query: ${query}`)
      );
      })
    );
  }

  searchByCountry(query: string):Observable<Country[]>{

    query=query.toLowerCase();
        if(this.queryCacheCountry.has(query)){
      return of(this.queryCacheCountry.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`).pipe(
      map((resp)=> CountryMapper.mapRestCountryArraytoCountryArray(resp)),
      tap((countries)=> this.queryCacheCountry.set(query,countries)),
      delay(1500),
      catchError((error)=>{
        console.log('Error fetching',error);
        return throwError(()=> new Error(`No se pudo obtener pais con ese query: ${query}`)
      );
      })
    );
  }

    searchByRegion(region: Region):Observable<Country[]>{

    const url = `${API_URL}/region/${region}`;

    if(this.queryCacheRegion.has(region)){
      return of(this.queryCacheRegion.get(region) ?? []);
    }

    return this.http.get<RESTCountry[]>(url).pipe(
      map((resp)=> CountryMapper.mapRestCountryArraytoCountryArray(resp)),
      tap((countries)=> this.queryCacheCountry.set(region,countries)),
      catchError((error)=>{
        console.log('Error fetching',error);
        return throwError(()=> new Error(`No se pudo obtener region: ${region}`)
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
