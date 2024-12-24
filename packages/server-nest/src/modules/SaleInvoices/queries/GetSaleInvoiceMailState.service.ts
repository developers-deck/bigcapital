// import { Inject, Injectable } from '@nestjs/common';
// import { GetSaleInvoiceMailStateTransformer } from './GetSaleInvoiceMailState.transformer';
// import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
// import { SaleInvoice } from '../models/SaleInvoice';

// @Injectable()
// export class GetSaleInvoiceMailState {
//   constructor(
//     private transformer: TransformerInjectable,
//     // private invoiceMail: SendSaleInvoiceMailCommon,

//     @Inject(SaleInvoice.name)
//     private saleInvoiceModel: typeof SaleInvoice,
//   ) {}

//   /**
//    * Retrieves the invoice mail state of the given sale invoice.
//    * Invoice mail state includes the mail options, branding attributes and the invoice details.
//    * @param {number} saleInvoiceId - Sale invoice id.
//    * @returns {Promise<SaleInvoiceMailState>}
//    */
//   async getInvoiceMailState(
//     saleInvoiceId: number,
//   ): Promise<SaleInvoiceMailState> {
//     const saleInvoice = await this.saleInvoiceModel
//       .query()
//       .findById(saleInvoiceId)
//       .withGraphFetched('customer')
//       .withGraphFetched('entries.item')
//       .withGraphFetched('pdfTemplate')
//       .throwIfNotFound();

//     const mailOptions =
//       await this.invoiceMail.getInvoiceMailOptions(saleInvoiceId);

//     // Transforms the sale invoice mail state.
//     const transformed = await this.transformer.transform(
//       saleInvoice,
//       new GetSaleInvoiceMailStateTransformer(),
//       {
//         mailOptions,
//       },
//     );
//     return transformed;
//   }
// }
