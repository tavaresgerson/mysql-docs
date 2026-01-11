### 27.3.9 Using WebAssembly Libraries

This section discusses compilation of C, C++, or other code to WebAssembly, incorporating the compiled code into a MySQL library, and using such a library in MySQL JavaScript programs.

In the examples that follow, to compile C code to WebAssembly, we employ the Emscripten toolchain, for which you can obtain source or binaries from `https://emscripten.org/docs/getting_started/downloads.html`. We assume in the remainder of this discussion that you have downloaded and installed it according to the Emscripten documentation; we suggest you begin with `https://emscripten.org/docs/getting_started/index.html`.

In this example, we first save the following C code containing three simple functions to a file named `main.c`:

```
int foo() { return 42; }

int bar(int x) { return x + foo(); }

int my_add(int a, int b) { return a + b; }
```

If you have not yet read the necessary environment and other variables into the current terminal session, do so before proceeding, using the command shown here:

```
$> source ./emsdk_env.sh
```

You should now be able to compile this file to WebAssembly using the following Emscripten command:

```
$> emcc --no-entry -s EXPORTED_FUNCTIONS=_foo,_bar,_my_add -o my_module.wasm main.c -O3
```

`EXPORTED_FUNCTIONS` lists all the C functions that should be exported so that the JavaScript module can import them.

The WebAssembly module just created can now be loaded and the exported functions used in a JavaScript stored program as shown here, where the input parameter `wasm_src` is a binary buffer loaded from `my_module.wasm`:

```
CREATE FUNCTION my_func(IN wasm_src LONGBLOB) RETURNS INT LANGUAGE JAVASCRIPT
AS $$
  // Create a new WebAssembly module instance
  const wasmModule = new WebAssembly.Module(wasm_src)
  let wasmInstance = new WebAssembly.Instance(wasmModule)

  // Access exported functions through its exports member
  let expect42 = wasmInstance.exports.foo();
  console.log("expect42: ", expect42);

  let expect49 = wasmInstance.exports.bar(7);
  console.log("expect49: ", expect49);

  let expect3 = wasmInstance.exports.my_add(1, 2);
  console.log("expect3: ", expect3);

  return 0;
$$;
```

To test `my_func()`, first execute the following SQL statement, adjusting the path as necessary to local conditions:

```
mysql> SET @wasm_content=LOAD_FILE('path/to/my_module.wasm');
```

You must have the `FILE` privilege to use the SQL `LOAD_FILE()` function. The `secure_file_priv` server system variable also has an effect on data import and export operations; see this variable's description for more information.

Now you can invoke the function and view its output, like this:

```
mysql> SELECT my_func(@wasm_content);
+-------------------------+--------------+
|  my_func(@wasm_content) | expect42: 42
                            expect49: 49
                            expect3: 3   |
+-------------------------+--------------+
```
