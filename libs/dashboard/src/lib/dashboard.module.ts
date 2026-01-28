import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { StatsComponent } from './components/stats/stats.component';
import { HistoryComponent } from './components/history/history.component';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';

@NgModule({
  imports: [
    DashboardComponent, StatsComponent, HistoryComponent,
    CommonModule,
    NgZorroAntdModule,
    RouterModule.forChild([
      { path: '', component: DashboardComponent },
    ]),
  ],
})
export class DashboardModule { }
