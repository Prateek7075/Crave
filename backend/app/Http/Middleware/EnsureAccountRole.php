<?php

namespace App\Http\Middleware;

use App\Enums\AccountRole;
use App\Http\Middleware\AssignRequestId;
use App\Models\Account;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureAccountRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $account = $request->user();

        if (! $account instanceof Account) {
            return response()->json([
                'error' => [
                    'code' => 'UNAUTHENTICATED',
                    'message' => 'Authentication is required.',
                ],
                'requestId' => $request->attributes->get(AssignRequestId::REQUEST_ATTRIBUTE),
            ], Response::HTTP_UNAUTHORIZED);
        }

        foreach ($roles as $role) {
            if (AccountRole::tryFrom($role) === $account->role) {
                return $next($request);
            }
        }

        return response()->json([
            'error' => [
                'code' => 'FORBIDDEN',
                'message' => 'You do not have permission to access this resource.',
            ],
            'requestId' => $request->attributes->get(AssignRequestId::REQUEST_ATTRIBUTE),
        ], Response::HTTP_FORBIDDEN);
    }
}
