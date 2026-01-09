#### 5.1.8.3 Variáveis de sistema estruturado

Uma variável estruturada difere de uma variável de sistema comum em dois aspectos:

- Seu valor é uma estrutura com componentes que especificam parâmetros do servidor considerados intimamente relacionados.

- Pode haver várias instâncias de um determinado tipo de variável estruturada. Cada uma tem um nome diferente e se refere a um recurso diferente mantido pelo servidor.

O MySQL suporta um tipo de variável estruturada, que especifica parâmetros que regem o funcionamento dos caches de chaves. Uma variável estruturada de cache de chave tem esses componentes:

- `key_buffer_size`
- `key_cache_block_size`
- `key_cache_division_limit`
- `key_cache_age_threshold`

Esta seção descreve a sintaxe para referenciar variáveis estruturadas. As variáveis de cache de chave são usadas para exemplos de sintaxe, mas detalhes específicos sobre como as caches de chave funcionam são encontrados em outro lugar, em Seção 8.10.2, “A Cache de Chave MyISAM”.

Para se referir a um componente de uma instância de variável estruturada, você pode usar um nome composto no formato *`instance_name.component_name`*. Exemplos:

```sql
hot_cache.key_buffer_size
hot_cache.key_cache_block_size
cold_cache.key_cache_block_size
```

Para cada variável de sistema estruturada, uma instância com o nome `default` é sempre predefinida. Se você se referir a um componente de uma variável estruturada sem nenhum nome de instância, a instância `default` é usada. Assim, `default.key_buffer_size` e `key_buffer_size` referem-se à mesma variável de sistema.

As instâncias e componentes variáveis estruturadas seguem estas regras de nomenclatura:

- Para um determinado tipo de variável estruturada, cada instância deve ter um nome que seja único *dentro* das variáveis desse tipo. No entanto, os nomes das instâncias não precisam ser únicos *entre* os tipos de variáveis estruturadas. Por exemplo, cada variável estruturada tem uma instância chamada `default`, então `default` não é único entre os tipos de variáveis.

- Os nomes dos componentes de cada tipo de variável estruturada devem ser únicos em todos os nomes de variáveis do sistema. Se isso não fosse verdade (ou seja, se dois tipos diferentes de variáveis estruturadas pudessem compartilhar nomes de membros de componentes), não seria claro qual variável estruturada padrão usar para referências a nomes de membros que não são qualificados por um nome de instância.

- Se o nome de uma instância de variável estruturada não for legal como um identificador não citado, consulte-o como um identificador citado usando aspas. Por exemplo, `hot-cache` não é legal, mas `hot-cache` é.

- `global`, `session` e `local` não são nomes de instâncias válidos. Isso evita conflitos com notações como `@@GLOBAL.var_name` para referenciar variáveis de sistema não estruturadas.

Atualmente, as duas primeiras regras não têm possibilidade de serem violadas, pois o único tipo de variável estruturada é o da cache de chaves. Essas regras podem assumir maior importância se algum outro tipo de variável estruturada for criado no futuro.

Com uma exceção, você pode referenciar componentes de variáveis estruturadas usando nomes compostos em qualquer contexto em que nomes de variáveis simples possam ocorrer. Por exemplo, você pode atribuir um valor a uma variável estruturada usando uma opção de linha de comando:

```sql
$> mysqld --hot_cache.key_buffer_size=64K
```

Em um arquivo de opção, use a seguinte sintaxe:

```sql
[mysqld]
hot_cache.key_buffer_size=64K
```

Se você iniciar o servidor com essa opção, ele cria um cache de chaves chamado `hot_cache` com um tamanho de 64 KB, além do cache de chaves padrão que tem um tamanho padrão de 8 MB.

Suponha que você inicie o servidor da seguinte forma:

```sql
$> mysqld --key_buffer_size=256K \
         --extra_cache.key_buffer_size=128K \
         --extra_cache.key_cache_block_size=2048
```

Neste caso, o servidor define o tamanho do cache de chaves padrão para 256 KB. (Você também poderia ter escrito `--default.key_buffer_size=256K`. Além disso, o servidor cria um segundo cache de chaves chamado `extra_cache` que tem um tamanho de 128 KB, com o tamanho dos blocos de buffers para cache de blocos de índice de tabela definido em 2048 bytes.

O exemplo a seguir inicia o servidor com três caches de chave diferentes, com tamanhos em uma proporção de 3:1:1:

```sql
$> mysqld --key_buffer_size=6M \
         --hot_cache.key_buffer_size=2M \
         --cold_cache.key_buffer_size=2M
```

Valores de variáveis estruturadas também podem ser definidos e recuperados em tempo de execução. Por exemplo, para definir um cache de chave chamado `hot_cache` com um tamanho de 10 MB, use uma das seguintes instruções:

```sql
mysql> SET GLOBAL hot_cache.key_buffer_size = 10*1024*1024;
mysql> SET @@GLOBAL.hot_cache.key_buffer_size = 10*1024*1024;
```

Para recuperar o tamanho do cache, faça o seguinte:

```sql
mysql> SELECT @@GLOBAL.hot_cache.key_buffer_size;
```

No entanto, a seguinte declaração não funciona. A variável não é interpretada como um nome composto, mas como uma string simples para uma operação de correspondência de padrões `LIKE` (funções de comparação de strings.html#operador_like):

```sql
mysql> SHOW GLOBAL VARIABLES LIKE 'hot_cache.key_buffer_size';
```

Essa é a exceção para poder usar nomes de variáveis estruturadas em qualquer lugar onde um nome de variável simples possa ocorrer.
