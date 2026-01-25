#### B.3.2.15 Não é possível inicializar o character set

Você pode ver um erro como este se tiver problemas com o character set:

```sql
MySQL Connection Failed: Can't initialize character set charset_name
```

Este erro pode ter as seguintes causas:

* O character set é um character set multibyte e você não tem suporte para o character set no client. Neste caso, você precisa recompilar o client executando o **CMake** com a opção [`-DDEFAULT_CHARSET=charset_name`](source-configuration-options.html#option_cmake_default_charset) ou [`-DWITH_EXTRA_CHARSETS=charset_name`](source-configuration-options.html#option_cmake_with_extra_charsets). Veja [Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”](source-configuration-options.html "2.8.7 Opções de Configuração de Fonte do MySQL").

  Todos os binários padrão do MySQL são compilados com [`-DWITH_EXTRA_CHARSETS=complex`](source-configuration-options.html#option_cmake_with_extra_charsets), o que habilita o suporte para todos os character sets multibyte. Veja [Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”](source-configuration-options.html "2.8.7 Opções de Configuração de Fonte do MySQL").

* O character set é um character set simples que não está compilado no [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL"), e os arquivos de definição do character set não estão no local onde o client espera encontrá-los.

  Neste caso, você precisa usar um dos seguintes métodos para resolver o problema:

  + Recompilar o client com suporte para o character set. Veja [Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”](source-configuration-options.html "2.8.7 Opções de Configuração de Fonte do MySQL").

  + Especificar para o client o diretório onde os arquivos de definição do character set estão localizados. Para muitos clients, você pode fazer isso com a opção `--character-sets-dir`.

  + Copiar os arquivos de definição de character para o caminho onde o client espera que eles estejam.