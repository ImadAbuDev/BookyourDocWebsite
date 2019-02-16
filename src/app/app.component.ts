import {Component, OnInit} from '@angular/core';
import {UserService} from './services/user.service';
import {DataService} from './services/data.service';

@Component({
  selector: 'app-bookyourdoc',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})

export class AppComponent implements OnInit {
  constructor(public DataSvc: DataService) {

  }

  ngOnInit() {

  }

}
