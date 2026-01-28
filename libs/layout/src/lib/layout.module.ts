import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './containers/layout/layout.component';
import { NgZorroAntdModule } from "@batstateu/ng-zorro-antd";
import { RouterModule } from "@angular/router";
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { LayoutViewComponent } from './components/layout-view/layout-view.component';

@NgModule({
  imports: [CommonModule, NgZorroAntdModule, RouterModule, LayoutComponent,
    HeaderComponent,
    FooterComponent,
    SideNavComponent,
    LayoutViewComponent],
  declarations: [

  ]
})
export class LayoutModule { }
