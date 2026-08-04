<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

final class AssignRequestId
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */

    public const string HEADER_NAME = 'X-Request-Id';

    public const string REQUEST_ATTRIBUTE = 'request-id';
    private const int MAX_LENGTH = 100;

    public function handle(Request $request, Closure $next): Response
    {
        $requestId = $this->resolveRequestId($request);

        $request->attributes->set(self::REQUEST_ATTRIBUTE, $requestId);

        Context::add('request_id', $requestId);
        $response = $next($request);
        $response->headers->set(self::HEADER_NAME, $requestId);

        return $response;
    }

    private function resolveRequestId(Request $request): string{
        $incomingRequestId = $request->header(self::HEADER_NAME);

        if(!is_string($incomingRequestId)){
            return Str::uuid()->toString();
        }

        $requestId = trim($incomingRequestId);

        if($requestId === '' || mb_strlen($requestId) > self::MAX_LENGTH){
            return Str::uuid()->toString();
        }

        return $requestId;
    }
}
