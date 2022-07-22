const db = require("./db");

/**
 * Unsafe code generation, for OTP only.
 * @returns <string>
 */
function generateCode() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

export { generateCode };

