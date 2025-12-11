import type { Resident } from '@/types/entity';
import { BaseService } from '@/services/base.service';

export class OperatorResidentService extends BaseService<Resident> {
  protected endpoint = '/operator/residents';
}

export default new OperatorResidentService();
