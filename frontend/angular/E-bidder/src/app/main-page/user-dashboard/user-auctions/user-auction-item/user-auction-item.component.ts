import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {itemModel} from "../../../../shared/Models/ItemModel";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {AuctionItemModel} from "../../../../shared/Models/AuctionItem.model";
import {HttpClient} from "@angular/common/http";
import {freeItems, items} from "../../../../shared/server-endpoints";

@Component({
  selector: 'app-user-auction-item',
  templateUrl: './user-auction-item.component.html',
  styleUrls: ['./user-auction-item.component.css']
})
export class UserAuctionItemComponent implements OnInit {

  @Input() AuctionItem:AuctionItemModel;
  @Input() Index:number;
  @Output() AuctionDeleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() AuctionUpdated: EventEmitter<any> = new EventEmitter<any>();
  isCollapsed = true;
  IsActive:boolean;
  modalRef: BsModalRef;
  Categories:string[]=[];
  constructor(private modalService: BsModalService,private http:HttpClient) { }

  ngOnInit() {
    this.CheckIfAuctionHasStarted(this.AuctionItem.startedAt);
    this.GetCategories(this.AuctionItem.categories);
  }

  GetCategories(categories){
    for (let category of categories){
      this.Categories.push(category.name);
    }
  }


  OpenModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  CloseModal() {
    this.modalRef.hide();
  }

  convertStrToDate(AuctionDate){
    const str = AuctionDate.split('-');
    const str1 = str[2].split(' ');
    str[2]=str1[0];
    str.push(str1[1]);
    const strTime = str[3].split(":");
    str[3]=strTime[0];
    str.push(strTime[1]);
    str.push(strTime[2]);
    return new Date(str[0],str[1]-1,str[2],str[3],str[4],str[5]);
  }

  CheckIfAuctionHasStarted(AuctionDate){
    const StartDate = this.convertStrToDate(AuctionDate);
    this.IsActive = StartDate.valueOf() <= Date.now();
  }

  ItemDeleted(index){
    this.http.delete<AuctionItemModel>(items+'/'+this.AuctionItem.id).subscribe(
      ()=>{
        this.AuctionDeleted.emit(index);
        this.modalRef.hide();
      }
    );

  }

  Update(id){
    this.http.get<AuctionItemModel>(freeItems+'/'+id).subscribe(
      (NewItem:AuctionItemModel)=>{
        this.AuctionUpdated.emit(NewItem);
        this.modalRef.hide();

      }
    )
  }

}