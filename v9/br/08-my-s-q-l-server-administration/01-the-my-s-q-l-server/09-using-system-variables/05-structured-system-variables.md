#### 7.1.9.5 Variáveis de Sistema Estruturadas

Uma variável estruturada difere de uma variável de sistema comum em dois aspectos:

* Seu valor é uma estrutura com componentes que especificam parâmetros do servidor considerados intimamente relacionados.

* Pode haver várias instâncias de um determinado tipo de variável estruturada. Cada uma tem um nome diferente e se refere a um recurso diferente mantido pelo servidor.

O MySQL suporta um único tipo de variável estruturada, que especifica parâmetros que regem a operação de caches de chaves. Uma variável estruturada de cache de chaves tem esses componentes:

* `key_buffer_size`
* `key_cache_block_size`
* `key_cache_division_limit`
* `key_cache_age_threshold`

Esta seção descreve a sintaxe para referenciar variáveis estruturadas. As variáveis de cache de chaves são usadas para exemplos de sintaxe, mas detalhes específicos sobre como os caches de chaves operam são encontrados em outro lugar, na Seção 10.10.2, “O Cache de Chaves MyISAM”.

Para referenciar um componente de uma instância de uma variável estruturada, você pode usar um nome composto no formato *`instance_name.component_name`*. Exemplos:

```
hot_cache.key_buffer_size
hot_cache.key_cache_block_size
cold_cache.key_cache_block_size
```

Para cada variável de sistema estruturada, uma instância com o nome de `default` é sempre predefinida. Se você se referir a um componente de uma variável estruturada sem qualquer nome de instância, a instância `default` é usada. Assim, `default.key_buffer_size` e `key_buffer_size` referem-se ao mesmo variável de sistema.

As instâncias e componentes das variáveis estruturadas seguem estas regras de nomenclatura:

* Para um determinado tipo de variável estruturada, cada instância deve ter um nome que seja único *dentro* das variáveis desse tipo. No entanto, os nomes das instâncias não precisam ser únicos *entre* os tipos de variáveis estruturadas. Por exemplo, cada variável estruturada tem uma instância chamada `default`, então `default` não é único entre os tipos de variáveis.

* Os nomes dos componentes de cada tipo de variável estruturada devem ser únicos em todos os nomes de variáveis do sistema. Se isso não fosse verdade (ou seja, se dois tipos diferentes de variáveis estruturadas pudessem compartilhar nomes de membros de componentes), não seria claro qual variável estruturada padrão usar para referências a nomes de membros que não são qualificados por um nome de instância.

* Se o nome de instância de uma variável estruturada não for legal como um identificador não citado, referencie-o como um identificador citado usando aspas. Por exemplo, `hot-cache` não é legal, mas ```
$> mysqld --hot_cache.key_buffer_size=64K
``` é.

* `global`, `session` e `local` não são nomes de instâncias legais. Isso evita um conflito com notações como `@@GLOBAL.var_name` para referenciar variáveis de sistema não estruturadas.

Atualmente, as duas primeiras regras não têm possibilidade de serem violadas porque o único tipo de variável estruturada é o da cache de chaves. Essas regras podem assumir maior importância se algum outro tipo de variável estruturada for criado no futuro.

Com uma exceção, você pode referenciar os componentes de variáveis estruturadas usando nomes compostos em qualquer contexto onde nomes de variáveis simples podem ocorrer. Por exemplo, você pode atribuir um valor a uma variável estruturada usando uma opção de linha de comando:

```
[mysqld]
hot_cache.key_buffer_size=64K
```

Em um arquivo de opção, use a seguinte sintaxe:

```
$> mysqld --key_buffer_size=256K \
         --extra_cache.key_buffer_size=128K \
         --extra_cache.key_cache_block_size=2048
```

Se você iniciar o servidor com essa opção, ele cria uma cache de chaves chamada `hot_cache` com um tamanho de 64KB, além da cache de chaves padrão que tem um tamanho padrão de 8MB.

Suponha que você inicie o servidor da seguinte forma:

```
$> mysqld --key_buffer_size=6M \
         --hot_cache.key_buffer_size=2M \
         --cold_cache.key_buffer_size=2M
```

Neste caso, o servidor define o tamanho do cache de chaves padrão em 256 KB. (Você também poderia ter escrito `--default.key_buffer_size=256K`. Além disso, o servidor cria um segundo cache de chaves chamado `extra_cache` que tem um tamanho de 128 KB, com o tamanho dos buffers de bloco para o cache de blocos de índice de tabela definido em 2048 bytes.

O exemplo a seguir inicia o servidor com três caches de chaves diferentes que têm tamanhos em uma proporção de 3:1:1:

```
mysql> SET GLOBAL hot_cache.key_buffer_size = 10*1024*1024;
mysql> SET @@GLOBAL.hot_cache.key_buffer_size = 10*1024*1024;
```

Valores de variáveis estruturadas também podem ser definidos e recuperados em tempo de execução. Por exemplo, para definir um cache de chaves chamado `hot_cache` para um tamanho de 10 MB, use uma das seguintes instruções:

```
mysql> SELECT @@GLOBAL.hot_cache.key_buffer_size;
```

Para recuperar o tamanho do cache, faça isso:

```
mysql> SHOW GLOBAL VARIABLES LIKE 'hot_cache.key_buffer_size';
```

No entanto, a seguinte instrução não funciona. A variável não é interpretada como um nome composto, mas como uma string simples para uma operação de correspondência de padrões `LIKE`:



Esta é a exceção para poder usar nomes de variáveis estruturadas em qualquer lugar onde um nome de variável simples possa ocorrer.