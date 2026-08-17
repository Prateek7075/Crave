<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RestaurantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'id' => $this->id,

            'name' => $this->name,

            'slug' => $this->slug,

            'description' => $this->description,

            'verificationStatus' => $this->verification_status,

            'operatingStatus' => $this->operating_status,

            'contactNumber' => $this->contact_number,
            'contactEmail' => $this->contact_email,

            'addressLine1' => $this->address_line_1,
            'addressLine2' => $this->address_line_2,
            'landmark' => $this->landmark,
            'city' => $this->city,
            'state' => $this->state,
            'pincode' => $this->pincode,
            'latitude' => $this->latitude !== null ? (float) $this->latitude : null,
            'longitude' => $this->longitude !== null ? (float) $this->longitude : null,

            'fssaiLicenseNumber' => $this->fssai_license_number,
            'gstin' => $this->gstin,

            'submittedAt' => $this->submitted_at,

            'approvedAt' => $this->approved_at,

            'createdAt' => $this->created_at,

            'updatedAt' => $this->updated_at,
        ];
    }
}
