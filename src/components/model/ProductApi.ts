import {
	ApiListResponse,
	IProductApi,
	Order,
	OrderRespose,
	ProductItem,
} from '../../types';
import { Api } from '../base/api';
import { CDN_URL } from '../../utils/constants';

export class ProductApi extends Api implements IProductApi {
	readonly _cdn: string;

	constructor(baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);

		this._cdn = CDN_URL;
	}

	async getProductItem(id: string): Promise<ProductItem> {
		const item = (await this.get(`/product/${id}`)) as ProductItem;
		return {
			...item,
			image: this._cdn + item.image,
		};
	}

	async getProductList(): Promise<ProductItem[]> {
		const response = (await this.get(
			`/product/`
		)) as ApiListResponse<ProductItem>;
		return response.items.map((el) => ({
			...el,
			image: this._cdn + el.image,
		}));
	}

	async postOrder(orderBody: Order): Promise<OrderRespose> {
		return (await this.post('/order', orderBody)) as OrderRespose;
	}
}
