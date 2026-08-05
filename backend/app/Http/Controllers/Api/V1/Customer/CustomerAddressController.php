<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Customer\StoreCustomerAddressRequest;
use App\Http\Resources\Api\V1\CustomerAddressResource;
use App\Models\Account;
use App\Models\CustomerAddress;
use App\Services\Customer\CreateCustomerAddressService;
use App\Services\Customer\UpdateCustomerAddressService;
use Illuminate\Http\JsonResponse;
use LogicException;
use Symfony\Component\HttpFoundation\Response;
use App\Services\Customer\ListCustomerAddressesService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use App\Services\Customer\DeleteCustomerAddressService;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Requests\Api\V1\Customer\UpdateCustomerAddressRequest;
use App\Services\Customer\GetCustomerAddressService;

class CustomerAddressController extends Controller
{

    public function index(Request $request, ListCustomerAddressesService $service): AnonymousResourceCollection{
        $account = $request->user();

        if (!$account instanceof Account) {
            throw new LogicException(
                'The authenticated account could not be resolved.',
            );
        }

        $addresses = $service->list($account);

        return CustomerAddressResource::collection($addresses);

    }

    public function show(Request $request, int $addressId, GetCustomerAddressService $service): CustomerAddressResource{

        $account = $request->user();

        if (!$account instanceof Account) {
            throw new LogicException(
                'The authenticated account could not be resolved.',
            );
        }

        $address = $service->get($account, $addressId,);

        return CustomerAddressResource::make($address,);
    }
    public function store(StoreCustomerAddressRequest $request, CreateCustomerAddressService $service): JsonResponse{
        $account = $request->user();

        if(! $account instanceof Account ){
            throw new LogicException('The authenticated account could not be resolved.');
        }

        $address = $service->create($account, $request->validated());

        return CustomerAddressResource::make($address)->response()->setStatusCode(Response::HTTP_CREATED);

    }

    public function destroy(Request $request, int $addressId, DeleteCustomerAddressService $service): HttpResponse{
        $account = $request->user();

        if (!$account instanceof Account) {
            throw new LogicException(
                'The authenticated account could not be resolved.',
            );
        }

        $service->delete($account, $addressId);

        return response()->noContent();
    }

    public function update(UpdateCustomerAddressRequest $request, int $addressId, UpdateCustomerAddressService $service): CustomerAddressResource{
        $account = $request->user();

        if (!$account instanceof Account) {
            throw new LogicException(
                'The authenticated account could not be resolved.',
            );
        }

        $address = $service->update($account, $addressId, $request->validated(),);

        return CustomerAddressResource::make($address,);
    }
}
