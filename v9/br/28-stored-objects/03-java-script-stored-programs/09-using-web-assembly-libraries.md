### 27.3.9 Usando Bibliotecas WebAssembly

Esta seção discute a compilação de código C, C++ ou outro código para WebAssembly, a incorporação do código compilado em uma biblioteca MySQL e o uso dessa biblioteca em programas JavaScript MySQL.

Nos exemplos a seguir, para compilar código C para WebAssembly, utilizamos a cadeia de ferramentas Emscripten, para a qual você pode obter fontes ou binários em `https://emscripten.org/docs/getting_started/downloads.html`. Suponhamos que, no restante desta discussão, você tenha baixado e instalado conforme a documentação do Emscripten; sugerimos que você comece em `https://emscripten.org/docs/getting_started/index.html`.

Neste exemplo, primeiro salvamos o seguinte código C contendo três funções simples em um arquivo chamado `main.c`:

```
int foo() { return 42; }

int bar(int x) { return x + foo(); }

int my_add(int a, int b) { return a + b; }
```

Se você ainda não leu as variáveis de ambiente e outras variáveis para a sessão atual do terminal, faça isso antes de prosseguir, usando o comando mostrado aqui:

```
$> source ./emsdk_env.sh
```

Agora você deve ser capaz de compilar este arquivo para WebAssembly usando o seguinte comando Emscripten:

```
$> emcc --no-entry -s EXPORTED_FUNCTIONS=_foo,_bar,_my_add -o my_module.wasm main.c -O3
```

`EXPORTED_FUNCTIONS` lista todas as funções C que devem ser exportadas para que o módulo JavaScript possa importá-las.

O módulo WebAssembly recém-criado agora pode ser carregado e as funções exportadas usadas em um programa JavaScript armazenado como mostrado aqui, onde o parâmetro de entrada `wasm_src` é um buffer binário carregado de `my_module.wasm`:

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

Para testar `my_func()`, primeiro execute a seguinte instrução SQL, ajustando o caminho conforme necessário para as condições locais:

```
mysql> SET @wasm_content=LOAD_FILE('path/to/my_module.wasm');
```

Você deve ter o privilégio `FILE` para usar a função SQL `LOAD_FILE()`. A variável de sistema `secure_file_priv` também tem efeito nas operações de importação e exportação de dados; consulte a descrição dessa variável para obter mais informações.

Agora você pode invocar a função e visualizar sua saída, assim:

```
mysql> SELECT my_func(@wasm_content);
+-------------------------+--------------+
|  my_func(@wasm_content) | expect42: 42
                            expect49: 49
                            expect3: 3   |
+-------------------------+--------------+
```