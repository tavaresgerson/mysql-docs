## 4.7 Utilitários para Desenvolvimento de Programas

4.7.1 mysql_config — Exibir Opções para Compilação de Clients

4.7.2 my_print_defaults — Exibir Opções de Option Files

4.7.3 resolve_stack_dump — Resolver Dump Numérico de Stack Trace para Símbolos

Esta seção descreve alguns utilitários que podem ser úteis ao desenvolver programas MySQL.

Em shell scripts, você pode usar o programa **my_print_defaults** para fazer o parse de option files e ver quais opções seriam usadas por um determinado programa. O exemplo a seguir mostra a saída que **my_print_defaults** pode produzir quando solicitado a mostrar as opções encontradas nos grupos `[client]` e `[mysql]` :

```sql
$> my_print_defaults client mysql
--port=3306
--socket=/tmp/mysql.sock
--no-auto-rehash
```

Nota para desenvolvedores: O manuseio de option files é implementado na C client library simplesmente processando todas as opções no grupo ou grupos apropriados antes de quaisquer argumentos de linha de comando. Isso funciona bem para programas que usam a última instância de uma opção que é especificada múltiplas vezes. Se você tem um programa C ou C++ que lida com opções especificadas múltiplas vezes dessa forma, mas que não lê option files, você precisa adicionar apenas duas linhas para dar a ele essa capacidade. Verifique o código-fonte de qualquer um dos clients padrão do MySQL para ver como fazer isso.

Várias outras interfaces de linguagem para MySQL são baseadas na C client library, e algumas delas fornecem uma maneira de acessar o conteúdo dos option files. Estes incluem Perl e Python. Para detalhes, consulte a documentação da sua interface preferida.