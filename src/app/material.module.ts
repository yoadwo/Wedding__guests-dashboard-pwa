import { NgModule } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from "@angular/material/list";
import { MatTableModule} from '@angular/material/table';
import { ScrollingModule} from "@angular/cdk/scrolling";

@NgModule({
    exports: [
      MatButtonModule,
      MatCheckboxModule,
      MatFormFieldModule,
      MatInputModule,
      MatListModule,
      MatTableModule,
      ScrollingModule 
    ]
  })
  export class MaterialModule {}