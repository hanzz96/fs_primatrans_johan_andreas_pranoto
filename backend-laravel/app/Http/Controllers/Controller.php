<?php

namespace App\Http\Controllers\Api;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
  use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

  public function responsePayload(array $payload = array())
  {
    $return = array_merge([
      "code" => 200
    ], $payload);

    return response()->json($return);
  }

  public function responseSuccess(string $message)
  {
    return response()->json(
      [
        "code" => 200,
        "message" => $message
      ],
      200
    );
  }
}
