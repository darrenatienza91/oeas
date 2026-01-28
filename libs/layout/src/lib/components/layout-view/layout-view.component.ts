import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '@batstateu/data-models';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { Observable } from 'rxjs';

@Component({
  imports: [NgZorroAntdModule, AsyncPipe, RouterModule],
  selector: 'batstateu-layout-view',
  templateUrl: './layout-view.component.html',
  styleUrls: ['./layout-view.component.less'],
})
export class LayoutViewComponent implements OnInit {
  @Input() isCollapsed: boolean;
  @Input() user$!: Observable<User | null>;
  @Output() logout = new EventEmitter();
  constructor() {
    this.isCollapsed = false;
  }
  onLogout() {
    this.logout.emit();
  }

  ngOnInit(): void { }
}
