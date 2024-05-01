import { Api, ApiListResponse } from './base/api';
import { IProduct, IPaymentDetails, IPaymentResult, IAppApi } from '../types/index';

export class AppAPI extends Api implements IAppApi {
    readonly cdnUrl: string;

    constructor(cdnUrl: string, baseUrl: string, options: RequestInit = {}) {
        super(baseUrl, options);
        this.cdnUrl = cdnUrl;
    }

	async getProductList(): Promise<IProduct[]> {
		return this.get('/product/').then((data: ApiListResponse<IProduct>) => {
			return data.items.map(item => ({
				...item,
				image: this.cdnUrl + item.image,
			}));
		});
	}

	postPaymentProduct(order: IPaymentDetails): Promise<IPaymentResult> {
		return this.post('/order', order).then((data: IPaymentResult) => data);
	}
}
