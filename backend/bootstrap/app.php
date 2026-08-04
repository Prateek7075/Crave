<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\AssignRequestId;
use App\Exceptions\ApiException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use function PHPUnit\Framework\isString;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: 'api/v1',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->prepend(AssignRequestId::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
          function(Request $request, \Throwable $exception): bool {
              return $request->is('api/*') || $request->expectsJson();
          }
        );

        $exceptions->render(
            function(ApiException $e, Request $request): JsonResponse {
                $requestId = $request->attributes->get(AssignRequestId::REQUEST_ATTRIBUTE);

                $error  = [
                    'code' => $e->errorCode(),
                    'message' => $e->getMessage(),
                ];

                if($e -> details() !== []){
                    $error['details'] = $e->details();
                }

                return response()->json([
                    'error' => $error,
                    'requestId' => isString($requestId) ? $requestId : null,
                ],$e->statusCode());
            }
        );

        $exceptions->render(
            function(ValidationException $e, Request $request): JsonResponse {
                $requestId = $request->attributes->get(AssignRequestId::REQUEST_ATTRIBUTE);

                return response()->json([
                    'error' => [
                        'code' => 'VALIDATION_ERROR',
                        'message' => 'The submitted data is invalid.',
                        'details' => [
                            'fields' => $e->errors(),
                        ]
                    ],
                    'requestId' => isString($requestId) ? $requestId : null,
                ],422);
            }
        );

        $exceptions->render(
            function(NotFoundHttpException $e, Request $request): ?JsonResponse {
                if(!$request->is('api/*') || $request->route() !==null){
                    return null;
                }
                $requestId = $request->attributes->get(AssignRequestId::REQUEST_ATTRIBUTE);

                return response()->json([
                    'error' => [
                        'code' => 'NOT_FOUND',
                        'message' => 'The Requested API Route was Not Found.',
                    ],
                    'requestId' => isString($requestId) ? $requestId : null,
                ],404);
            }
        );

        $exceptions->render(
            function(MethodNotAllowedHttpException $e, Request $request): ?JsonResponse {
                if(!$request->is('api/*')){
                    return null;
                }

                $requestId = $request->attributes->get(AssignRequestId::REQUEST_ATTRIBUTE);

                return response()->json([
                    'error' => [
                        'code' => 'METHOD_NOT_ALLOWED',
                        'message' => 'The given request method is not allowed.',
                    ],
                    'requestId' => isString($requestId) ? $requestId : null,
                ],405, $e->getHeaders());
            }
        );

        $exceptions->render(
            function(\Throwable $e, Request $request): ?JsonResponse {
                if(!$request->is('api/*') || $e instanceof ApiException || $e instanceof ValidationException || $e instanceof HttpExceptionInterface){
                    return null;
                }

                $requestId = $request->attributes->get(AssignRequestId::REQUEST_ATTRIBUTE);

                return response()->json([
                    'error' => [
                        'code' => 'INTERNAL_SERVER_ERROR',
                        'message' => 'An unexpected error occurred.',
                    ],
                    'requestId' => isString($requestId) ? $requestId : null,
                ],500);
            }
        );
    })
    ->create();
