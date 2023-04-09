import { NgModule } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from "@angular/material/list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ScrollingModule} from "@angular/cdk/scrolling";

@NgModule({
    exports: [
      MatButtonModule,
      MatListModule,
      MatCheckboxModule,
      ScrollingModule 
    ]
  })
  export class MaterialModule {}