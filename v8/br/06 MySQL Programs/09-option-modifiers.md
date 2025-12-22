#### 6.2.2.4 Modificadores de opção de programa

Algumas opções são boolean e comportamento de controle que pode ser ativado ou desativado. Por exemplo, o cliente `mysql` suporta uma opção `--column-names` que determina se deve ou não exibir uma linha de nomes de coluna no início dos resultados da consulta. Por padrão, esta opção está habilitada. No entanto, você pode desativar em alguns casos, como quando enviar a saída do `mysql` para outro programa que espera ver apenas dados e não uma linha de cabeçalho inicial.

Para desativar nomes de colunas, você pode especificar a opção usando qualquer um destes formulários:

```
--disable-column-names
--skip-column-names
--column-names=0
```

Os prefixos `--disable` e `--skip` e o sufixo `=0` têm todos o mesmo efeito: desativam a opção.

A forma "activada" da opção pode ser especificada de qualquer das seguintes formas:

```
--column-names
--enable-column-names
--column-names=1
```

Os valores `ON`, `TRUE`, `OFF`, e `FALSE` também são reconhecidos para opções booleanas (não sensíveis a maiúsculas e minúsculas).

Se uma opção é precedida por `--loose`, um programa não sai com um erro se não reconhecer a opção, mas emite apenas um aviso:

```
$> mysql --loose-no-such-option
mysql: WARNING: unknown option '--loose-no-such-option'
```

O prefixo `--loose` pode ser útil quando você executa programas de múltiplas instalações do MySQL na mesma máquina e lista opções em um arquivo de opções. Uma opção que pode não ser reconhecida por todas as versões de um programa pode ser dada usando o prefixo `--loose` (ou `loose` em um arquivo de opções). Versões do programa que reconhecem a opção processá-lo normalmente, e versões que não o reconhecem emitir um aviso e ignorá-lo.

O `--maximum` está disponível apenas para `mysqld` e permite que um limite seja colocado sobre quão grandes programas cliente podem definir variáveis de sistema de sessão. Para fazer isso, use um `--maximum` com o nome da variável. Por exemplo, `--maximum-max_heap_table_size=32M` impede que qualquer cliente faça o limite de tamanho da tabela de heap maior que 32M.

O prefixo `--maximum` destina-se a ser usado com variáveis do sistema que têm um valor de sessão. Se aplicado a uma variável do sistema que tem apenas um valor global, ocorre um erro. Por exemplo, com `--maximum-back_log=200`, o servidor produz este erro:

```
Maximum value of 'back_log' cannot be set
```
