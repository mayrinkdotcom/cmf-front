import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopbarService } from 'src/app/services/topbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private router: Router,
    private topbarService: TopbarService,
    ) { }

  gastos(){
    this.router.navigate(['/bills']);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  ngOnInit() {
    this.topbarService.configBackButton(false);
  }

}
