import { HomeComponent } from './home/home.component';
import { TipsComponent } from './tips/tips.component';
import { AboutComponent } from './about/about.component';
import { Routes, RouterModule } from '@angular/router';

const arhaRoutes: Routes = [
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'tips', component: TipsComponent
  },
  {
    path: 'about', component: AboutComponent
  },
  {
    path: '', component: HomeComponent
  },
  {
    path: '**', component: HomeComponent
  }
];

export const arhaRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(arhaRoutes);
