## Ferramentas de Desenvolvimento de Programas

Esta seção descreve algumas ferramentas que você pode achar úteis ao desenvolver programas para o MySQL.

Em scripts de shell, você pode usar o programa `my_print_defaults` para analisar arquivos de opções e ver quais opções seriam usadas por um programa específico. O exemplo a seguir mostra a saída que `my_print_defaults` pode produzir quando solicitado a mostrar as opções encontradas nos grupos `[client]` e `[mysql]`:

```
$> my_print_defaults client mysql
--port=3306
--socket=/tmp/mysql.sock
--no-auto-rehash
```

Observação para desenvolvedores: O gerenciamento de arquivos de opções é implementado na biblioteca de cliente C simplesmente processando todas as opções no grupo ou grupos apropriados antes de quaisquer argumentos de linha de comando. Isso funciona bem para programas que usam a última instância de uma opção especificada várias vezes. Se você tem um programa em C ou C++ que lida com opções especificadas várias vezes dessa maneira, mas que não lê arquivos de opções, você precisa adicionar apenas duas linhas para dar a ele essa capacidade. Confira o código-fonte de qualquer um dos clientes padrão do MySQL para ver como fazer isso.

Várias outras interfaces de linguagem para o MySQL são baseadas na biblioteca de cliente C, e algumas delas fornecem uma maneira de acessar o conteúdo dos arquivos de opções. Isso inclui Perl e Python. Para detalhes, consulte a documentação da interface que você prefere.