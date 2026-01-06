## 4.7 Ferramentas de desenvolvimento de programas

4.7.1 mysql\_config — Exibir opções para a compilação de clientes

4.7.2 my\_print\_defaults — Opções de exibição a partir de arquivos de opção

4.7.3 resolve\_stack\_dump — Resolver o dump da pilha numérica para símbolos

Esta seção descreve algumas ferramentas que você pode achar úteis ao desenvolver programas do MySQL.

Em scripts de shell, você pode usar o programa **my\_print\_defaults** para analisar arquivos de opções e ver quais opções seriam usadas por um programa específico. O exemplo a seguir mostra a saída que **my\_print\_defaults** pode produzir quando solicitado a mostrar as opções encontradas nos grupos `[client]` e `[mysql]`:

```sql
$> my_print_defaults client mysql
--port=3306
--socket=/tmp/mysql.sock
--no-auto-rehash
```

Observação para desenvolvedores: O tratamento de arquivos de opções é implementado na biblioteca de clientes em C simplesmente processando todas as opções no grupo ou grupos apropriados antes de quaisquer argumentos da linha de comando. Isso funciona bem para programas que usam a última instância de uma opção especificada várias vezes. Se você tem um programa em C ou C++ que trata opções especificadas várias vezes dessa maneira, mas que não lê arquivos de opções, você precisa adicionar apenas duas linhas para dar a ele essa capacidade. Verifique o código-fonte de qualquer um dos clientes padrão do MySQL para ver como fazer isso.

Várias outras interfaces de linguagem para o MySQL são baseadas na biblioteca de clientes C, e algumas delas fornecem uma maneira de acessar o conteúdo do arquivo de opções. Isso inclui Perl e Python. Para obter detalhes, consulte a documentação da interface que você prefere.
