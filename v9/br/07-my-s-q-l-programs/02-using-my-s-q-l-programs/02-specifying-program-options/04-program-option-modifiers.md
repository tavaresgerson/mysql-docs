#### 6.2.2.4 Modificadores de Opções do Programa

Algumas opções são "booleanas" e controlam o comportamento que pode ser ativado ou desativado. Por exemplo, o cliente **mysql** suporta uma opção `--column-names` que determina se os nomes dos colunas devem ser exibidos no início dos resultados da consulta ou não. Por padrão, essa opção está habilitada. No entanto, você pode querer desabilitá-la em algumas situações, como ao enviar a saída do **mysql** para outro programa que espera ver apenas dados e não uma linha de cabeçalho inicial.

Para desabilitar os nomes das colunas, você pode especificar a opção usando qualquer uma dessas formas:

```
--disable-column-names
--skip-column-names
--column-names=0
```

Os prefixos `--disable` e `--skip` e o sufixo `=0` têm o mesmo efeito: desativam a opção.

A forma "habilitada" da opção pode ser especificada de qualquer uma dessas maneiras:

```
--column-names
--enable-column-names
--column-names=1
```

Os valores `ON`, `TRUE`, `OFF` e `FALSE` também são reconhecidos para opções booleanas (não são case-sensitive).

Se uma opção for prefixada com `--loose`, um programa não sai com um erro se não reconhecer a opção, mas em vez disso emite apenas uma mensagem de aviso:

```
$> mysql --loose-no-such-option
mysql: WARNING: unknown option '--loose-no-such-option'
```

O prefixo `--loose` pode ser útil quando você executa programas de várias instalações do MySQL na mesma máquina e lista opções em um arquivo de opções. Uma opção que pode não ser reconhecida por todas as versões de um programa pode ser fornecida usando o prefixo `--loose` (ou `loose` em um arquivo de opções). As versões do programa que reconhecem a opção processam-na normalmente, e as versões que não a reconhecem emitem um aviso e a ignoram.

O prefixo `--maximum` está disponível apenas para o **mysqld** e permite definir um limite para o tamanho máximo que os programas cliente podem definir as variáveis do sistema de sessão. Para fazer isso, use um prefixo `--maximum` com o nome da variável. Por exemplo, `--maximum-max_heap_table_size=32M` impede que qualquer cliente aumente o limite do tamanho da tabela de pilha para mais de 32M.

O prefixo `--maximum` é destinado ao uso com variáveis de sistema que têm um valor de sessão. Se aplicado a uma variável de sistema que tem apenas um valor global, ocorre um erro. Por exemplo, com `--maximum-back_log=200`, o servidor produz este erro:

```
Maximum value of 'back_log' cannot be set
```