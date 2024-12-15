import { Inject, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { SystemUser } from '../System/models/SystemUser';
import { TenantModel } from '../System/models/TenantModel';

@Injectable()
export class TenancyContext {
  constructor(
    private readonly cls: ClsService,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,

    @Inject(TenantModel.name)
    private readonly systemTenantModel: typeof TenantModel,
  ) {}

  /**
   * Get the current tenant.
   * @param {boolean} withMetadata - If true, the tenant metadata will be fetched.
   * @returns
   */
  getTenant(withMetadata: boolean = false) {
    // Get the tenant from the request headers.
    const organizationId = this.cls.get('organizationId');

    if (!organizationId) {
      throw new Error('Tenant not found');
    }
    const query = this.systemTenantModel.query().findOne({ organizationId });

    if (withMetadata) {
      query.withGraphFetched('metadata');
    }
    return query;
  }

  /**
   *
   * @returns
   */
  getSystemUser() {
    // Get the user from the request headers.
    const userId = this.cls.get('userId');

    return this.systemUserModel.query().findOne({ id: userId });
  }
}
