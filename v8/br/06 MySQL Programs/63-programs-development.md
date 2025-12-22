## 6.7 Utilidades de desenvolvimento de programas

Esta seção descreve alguns utilitários que você pode achar úteis ao desenvolver programas MySQL.

Em scripts shell, você pode usar o programa **my\_print\_defaults** para analisar arquivos de opções e ver quais opções seriam usadas por um determinado programa. O exemplo a seguir mostra a saída que **my\_print\_defaults** pode produzir quando solicitado a mostrar as opções encontradas nos grupos `[client]` e `[mysql]`:

```
$> my_print_defaults client mysql
--port=3306
--socket=/tmp/mysql.sock
--no-auto-rehash
```

Nota para desenvolvedores: O manuseio de arquivos de opção é implementado na biblioteca do cliente C simplesmente processando todas as opções no grupo ou grupos apropriados antes de quaisquer argumentos da linha de comando. Isso funciona bem para programas que usam a última instância de uma opção especificada várias vezes. Se você tem um programa C ou C ++ que lida com opções especificadas de forma múltipla, mas que não lê arquivos de opção, você precisa adicionar apenas duas linhas para dar a ele essa capacidade. Verifique o código-fonte de qualquer um dos clientes MySQL padrão para ver como fazer isso.

Várias outras interfaces de linguagem para o MySQL são baseadas na biblioteca do cliente C, e algumas delas fornecem uma maneira de acessar o conteúdo do arquivo de opções.
