//@RestController
//@RequestMapping("/api/auth")
//@RequiredArgsConstructor
//public class OAuth2Controller {
//
//    private final OAuth2Service oAuth2Service;
//
//    @PostMapping("/oauth2/login")
//    public ResponseEntity<AuthResponse> oauth2Login(@RequestBody OAuth2Request request) {
//        try {
//            AuthResponse response = oAuth2Service.authenticateWithOAuth2(
//                    request.getAccessToken(),
//                    request.getProvider()
//            );
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(null);
//        }
//    }
//
//    @GetMapping("/oauth2/providers")
//    public ResponseEntity<Map<String, String>> getOAuth2Providers() {
//        Map<String, String> providers = Map.of(
//                "google", "GOOGLE",
//                "facebook", "FACEBOOK"
//        );
//        return ResponseEntity.ok(providers);
//    }
//}