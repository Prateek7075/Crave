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

            'verificationStatus' => $this->verification_status->value,

            'operatingStatus' => $this->operating_status->value,

            'submittedAt' => $this->submitted_at,

            'approvedAt' => $this->approved_at,

            'createdAt' => $this->created_at,

            'updatedAt' => $this->updated_at,
        ];
    }
}
