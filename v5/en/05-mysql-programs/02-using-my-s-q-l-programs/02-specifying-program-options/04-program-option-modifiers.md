#### 4.2.2.4 Modificadores de Opções de Programa

Algumas options são "booleanas" e controlam um comportamento que pode ser ativado ou desativado. Por exemplo, o **mysql** client suporta a option `--column-names` que determina se uma linha de nomes de coluna deve ou não ser exibida no início dos resultados de uma Query. Por padrão, esta option está ativada. No entanto, você pode querer desativá-la em algumas instâncias, como ao enviar a saída do **mysql** para outro programa que espera ver apenas dados e não uma linha de cabeçalho inicial.

Para desativar os nomes das colunas, você pode especificar a option usando qualquer uma destas formas:

```sql
--disable-column-names
--skip-column-names
--column-names=0
```

Os prefixos `--disable` e `--skip` e o sufixo `=0` têm todos o mesmo efeito: Eles desativam a option.

A forma "ativada" da option pode ser especificada de qualquer uma destas maneiras:

```sql
--column-names
--enable-column-names
--column-names=1
```

Os valores `ON`, `TRUE`, `OFF` e `FALSE` também são reconhecidos para options booleanas (sem distinção entre maiúsculas e minúsculas).

Se uma option for prefixada por `--loose`, um programa não será encerrado com um erro caso não reconheça a option, mas emitirá apenas um warning:

```sql
$> mysql --loose-no-such-option
mysql: WARNING: unknown option '--loose-no-such-option'
```

O prefixo `--loose` pode ser útil quando você executa programas de múltiplas instalações do MySQL na mesma máquina e lista options em um arquivo de option. Uma option que pode não ser reconhecida por todas as versões de um programa pode ser fornecida usando o prefixo `--loose` (ou `loose` em um arquivo de option). As versões do programa que reconhecem a option a processam normalmente, e as versões que não a reconhecem emitem um warning e a ignoram.

O prefixo `--maximum` está disponível apenas para o **mysqld** e permite que seja imposto um limite sobre o quão grandes os programas client podem definir variáveis de sistema (system variables) de sessão. Para fazer isso, use o prefixo `--maximum` com o nome da variável. Por exemplo, `--maximum-max_heap_table_size=32M` impede que qualquer client torne o limite de tamanho da heap table maior que 32M.

O prefixo `--maximum` é destinado ao uso com system variables que possuem um valor de sessão. Se aplicado a uma system variable que possui apenas um valor global, ocorre um erro. Por exemplo, com `--maximum-back_log=200`, o server produz este erro:

```sql
Maximum value of 'back_log' cannot be set
```