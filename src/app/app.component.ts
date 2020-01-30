import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {switchMapTo} from 'rxjs/operators';

interface Contacts {
  _id: string;
  name: string;
  email: string;
  createDate: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient) {
  }

  event$ = new BehaviorSubject(true);
  contacts = this.event$.pipe(
    switchMapTo(this.http.get<Array<Contacts>>('/api/contacts/'))
  );

  refetchData() {
    this.event$.next(true);
  }

  ngOnInit(): void {
  }

  addContact(name, email) {
    this.refetchData();
    const reqBody = {
      name: name.value,
      email: email.value
    };
    this.http.post('/api/contacts/', reqBody)
      .subscribe((data) => {
        if (data) {
          this.refetchData();
          name.value = '';
          email.value = '';
        }
      });
  }
}
