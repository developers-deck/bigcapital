import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VendorsApplication } from './VendorsApplication.service';
import {
  IVendorEditDTO,
  IVendorNewDTO,
  IVendorOpeningBalanceEditDTO,
} from './types/Vendors.types';

@Controller('vendors')
export class VendorsController {
  constructor(private vendorsApplication: VendorsApplication) {}

  @Get(':id')
  getVendor(@Param('id') vendorId: number) {
    return this.vendorsApplication.getVendor(vendorId);
  }

  @Post()
  createVendor(@Body() vendorDTO: IVendorNewDTO) {
    return this.vendorsApplication.createVendor(vendorDTO);
  }

  @Put(':id')
  editVendor(@Param('id') vendorId: number, @Body() vendorDTO: IVendorEditDTO) {
    return this.vendorsApplication.editVendor(vendorId, vendorDTO);
  }

  @Delete(':id')
  deleteVendor(@Param('id') vendorId: number) {
    return this.vendorsApplication.deleteVendor(vendorId);
  }

  @Put(':id/opening-balance')
  editOpeningBalance(
    @Param('id') vendorId: number,
    @Body() openingBalanceDTO: IVendorOpeningBalanceEditDTO,
  ) {
    return this.vendorsApplication.editOpeningBalance(
      vendorId,
      openingBalanceDTO,
    );
  }
}
