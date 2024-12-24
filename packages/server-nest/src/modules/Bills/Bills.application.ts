
import { CreateBill } from './commands/CreateBill.service';
import { EditBillService } from './commands/EditBill.service';
import { GetBill } from './queries/GetBill';
// import { GetBills } from './queries/GetBills';
import { DeleteBill } from './commands/DeleteBill.service';
import {
  IBillDTO,
  IBillEditDTO,
} from './Bills.types';
import { GetDueBills } from './queries/GetDueBills.service';
import { OpenBillService } from './commands/OpenBill.service';
import { GetBillPayments } from './queries/GetBillPayments';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BillsApplication {
  constructor(
    private createBillService: CreateBill,
    private editBillService: EditBillService,
    private getBillService: GetBill,
    // private getBillsService: GetBills,
    private deleteBillService: DeleteBill,
    private getDueBillsService: GetDueBills,
    private openBillService: OpenBillService,
    private getBillPaymentsService: GetBillPayments,
  ) {}

  /**
   * Creates a new bill with associated GL entries.
   * @param {IBillDTO} billDTO
   * @returns
   */
  public createBill(billDTO: IBillDTO) {
    return this.createBillService.createBill(billDTO);
  }

  /**
   * Edits the given bill with associated GL entries.
   * @param {number} billId
   * @param {IBillEditDTO} billDTO
   * @returns
   */
  public editBill(billId: number, billDTO: IBillEditDTO) {
    return this.editBillService.editBill(billId, billDTO);
  }

  /**
   * Deletes the given bill with associated GL entries.
   * @param {number} billId - Bill id.
   * @returns {Promise<void>}
   */
  public deleteBill(billId: number) {
    return this.deleteBillService.deleteBill(billId);
  }

  /**
   * Retrieve bills data table list.
   * @param {number} tenantId -
   * @param {IBillsFilter} billsFilter -
   */
  // public getBills(
  //   filterDTO: IBillsFilter,
  // ) {
  //   return this.getBillsService.getBills(filterDTO);
  // }

  /**
   * Retrieves the given bill details.
   * @param {number} billId
   * @returns
   */
  public getBill(billId: number) {
    return this.getBillService.getBill(billId);
  }

  /**
   * Open the given bill.
   * @param {number} tenantId
   * @param {number} billId
   * @returns {Promise<void>}
   */
  public openBill(billId: number): Promise<void> {
    return this.openBillService.openBill(billId);
  }

  /**
   * Retrieves due bills of the given vendor.
   * @param {number} tenantId
   * @param {number} vendorId
   * @returns
   */
  public getDueBills(vendorId?: number) {
    return this.getDueBillsService.getDueBills(vendorId);
  }

  /**
   * Retrieve the specific bill associated payment transactions.
   * @param {number} tenantId
   * @param {number} billId
   */
  public getBillPayments(billId: number) {
    return this.getBillPaymentsService.getBillPayments(billId);
  }
}
