#### 7.1.9.5 Variaveis do sistema estruturado

Uma variável estruturada difere de uma variável de sistema regular em dois aspectos:

- O seu valor é uma estrutura com componentes que especificam parâmetros do servidor considerados estreitamente relacionados.
- Pode haver várias instâncias de um determinado tipo de variável estruturada. Cada uma tem um nome diferente e refere-se a um recurso diferente mantido pelo servidor.

O MySQL suporta um tipo de variável estruturada, que especifica parâmetros que regem a operação de cache de chaves.

- `key_buffer_size`
- `key_cache_block_size`
- `key_cache_division_limit`
- `key_cache_age_threshold`

Esta seção descreve a sintaxe para se referir a variáveis estruturadas. Variaveis de cache de chave são usadas para exemplos de sintaxe, mas detalhes específicos sobre como os caches de chave operam são encontrados em outro lugar, na Seção 10.10.2, The MyISAM Key Cache.

Para se referir a um componente de uma instância de variável estruturada, você pode usar um nome composto no formato \* `instance_name.component_name` \*.

```
hot_cache.key_buffer_size
hot_cache.key_cache_block_size
cold_cache.key_cache_block_size
```

Para cada variável de sistema estruturado, uma instância com o nome de `default` é sempre predefinida. Se você se referir a um componente de uma variável estruturada sem qualquer nome de instância, a instância `default` é usada. Assim, `default.key_buffer_size` e `key_buffer_size` ambos se referem à mesma variável de sistema.

As instâncias e componentes de variáveis estruturadas seguem estas regras de nomeação:

- Para um determinado tipo de variável estruturada, cada instância deve ter um nome que seja único \* dentro \* de variáveis desse tipo. No entanto, os nomes de instância não precisam ser únicos \* entre \* tipos de variáveis estruturadas. Por exemplo, cada variável estruturada tem uma instância chamada `default`, então `default` não é exclusivo entre tipos de variáveis.
- Os nomes dos componentes de cada tipo de variável estruturada devem ser únicos em todos os nomes de variáveis do sistema. Se isso não fosse verdade (ou seja, se dois tipos diferentes de variáveis estruturadas pudessem compartilhar nomes de membros de componentes), não seria claro qual variável estruturada padrão usar para referências a nomes de membros que não são qualificados por um nome de instância.
- Se um nome de instância de variável estruturado não é legal como um identificador não citado, refira-se a ele como um identificador citado usando backticks. Por exemplo, `hot-cache` não é legal, mas `` `hot-cache` `` é.
- `global`, `session`, e `local` não são nomes de instância legais. Isso evita um conflito com a notação como `@@GLOBAL.var_name` para se referir a variáveis de sistema não estruturadas.

Atualmente, as duas primeiras regras não têm possibilidade de serem violadas, porque o único tipo de variável estruturada é o tipo de cache de chaves.

Com uma exceção, você pode se referir a componentes de variáveis estruturadas usando nomes compostos em qualquer contexto em que nomes de variáveis simples possam ocorrer. Por exemplo, você pode atribuir um valor a uma variável estruturada usando uma opção de linha de comando:

```
$> mysqld --hot_cache.key_buffer_size=64K
```

Em um arquivo de opções, use esta sintaxe:

```
[mysqld]
hot_cache.key_buffer_size=64K
```

Se você iniciar o servidor com essa opção, ele cria um cache de chave chamado `hot_cache` com um tamanho de 64KB, além do cache de chave padrão que tem um tamanho padrão de 8MB.

Suponha que você inicie o servidor da seguinte forma:

```
$> mysqld --key_buffer_size=256K \
         --extra_cache.key_buffer_size=128K \
         --extra_cache.key_cache_block_size=2048
```

Neste caso, o servidor define o tamanho do cache de chave padrão em 256KB. (Você também poderia ter escrito `--default.key_buffer_size=256K`.) Além disso, o servidor cria um segundo cache de chave chamado `extra_cache` que tem um tamanho de 128KB, com o tamanho dos buffers de bloco para armazenar blocos de índice de tabela definidos em 2048 bytes.

O exemplo a seguir inicia o servidor com três caches de chaves diferentes com tamanhos em uma proporção de 3: 1: 1:

```
$> mysqld --key_buffer_size=6M \
         --hot_cache.key_buffer_size=2M \
         --cold_cache.key_buffer_size=2M
```

Valores de variáveis estruturadas podem ser definidos e recuperados em tempo de execução também. Por exemplo, para definir um cache de chave chamado `hot_cache` para um tamanho de 10MB, use qualquer uma dessas instruções:

```
mysql> SET GLOBAL hot_cache.key_buffer_size = 10*1024*1024;
mysql> SET @@GLOBAL.hot_cache.key_buffer_size = 10*1024*1024;
```

Para recuperar o tamanho do cache, faça o seguinte:

```
mysql> SELECT @@GLOBAL.hot_cache.key_buffer_size;
```

No entanto, a seguinte instrução não funciona. A variável não é interpretada como um nome composto, mas como uma simples string para uma operação de correspondência de padrão:

```
mysql> SHOW GLOBAL VARIABLES LIKE 'hot_cache.key_buffer_size';
```

Esta é a exceção para poder usar nomes de variáveis estruturadas em qualquer lugar em que um nome de variável simples possa ocorrer.
