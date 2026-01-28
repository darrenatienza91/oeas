import { Component, Input, OnInit } from '@angular/core';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';

@Component({
  imports: [NgZorroAntdModule],
  selector: 'batstateu-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.less']
})
export class SideNavComponent implements OnInit {
  @Input() isCollapsed!: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
