#### B.3.2.15 Não é possível inicializar o conjunto de caracteres

Você pode ver um erro como este se tiver problemas com o conjunto de caracteres:

```sql
MySQL Connection Failed: Can't initialize character set charset_name
```

Esse erro pode ter qualquer uma das seguintes causas:

- O conjunto de caracteres é um conjunto de caracteres multibyte e você não tem suporte para o conjunto de caracteres no cliente. Nesse caso, você precisa recompilar o cliente executando o **CMake** com a opção [`-DDEFAULT_CHARSET=charset_name`](source-configuration-options.html#option_cmake_default_charset) ou [`-DWITH_EXTRA_CHARSETS=charset_name`](source-configuration-options.html#option_cmake_with_extra_charsets). Veja [Seção 2.8.7, “Opções de Configuração de Código-Fonte do MySQL”](source-configuration-options.html).

  Todos os binários padrão do MySQL são compilados com [`-DWITH_EXTRA_CHARSETS=complex`](source-configuration-options.html#option_cmake_with_extra_charsets), o que permite o suporte para todos os conjuntos de caracteres multibyte. Veja [Seção 2.8.7, “Opções de Configuração de Código-Fonte do MySQL”](source-configuration-options.html).

- O conjunto de caracteres é um conjunto de caracteres simples que não está compilado no [**mysqld**](mysqld.html), e os arquivos de definição do conjunto de caracteres não estão no local onde o cliente espera encontrá-los.

  Nesse caso, você precisa usar um dos seguintes métodos para resolver o problema:

  - Reconcompile o cliente com suporte para o conjunto de caracteres. Consulte [Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”](source-configuration-options.html).

  - Especifique ao cliente o diretório onde os arquivos de definição do conjunto de caracteres estão localizados. Para muitos clientes, você pode fazer isso com a opção `--character-sets-dir`.

  - Copie os arquivos de definição de caracteres para o caminho onde o cliente espera que eles estejam.
