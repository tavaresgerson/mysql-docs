#### 15.7.2.2 Declaração de Criação de Grupo de Recursos

```
CREATE RESOURCE GROUP group_name
    TYPE = {SYSTEM|USER}
    [VCPU [=] vcpu_spec [, vcpu_spec] ...]
    [THREAD_PRIORITY [=] N]
    [ENABLE|DISABLE]

vcpu_spec: {N | M - N}
```

`CREATE RESOURCE GROUP` é usado para gerenciar grupos de recursos (veja a Seção 7.1.16, “Grupos de Recursos”). Esta declaração cria um novo grupo de recursos e atribui seus valores iniciais de atributos. Requer o privilégio `RESOURCE_GROUP_ADMIN`.

* `group_name`* identifica qual grupo de recursos será criado. Se o grupo já existir, ocorrerá um erro.

O atributo `TYPE` é obrigatório. Deve ser `SYSTEM` para um grupo de recursos de sistema, `USER` para um grupo de recursos de usuário. O tipo do grupo afeta os valores permitidos de `THREAD_PRIORITY`, conforme descrito mais adiante.

O atributo `VCPU` indica a afinidade de CPU, ou seja, o conjunto de CPUs virtuais que o grupo pode usar:

* Se `VCPU` não for fornecido, o grupo de recursos não terá afinidade de CPU e poderá usar todas as CPUs disponíveis.

* Se `VCPU` for fornecido, o valor do atributo é uma lista de números de CPU ou faixas de CPU separados por vírgula:

  + Cada número deve ser um inteiro no intervalo de 0 a `NUM_CPUS` − 1. Por exemplo, em um sistema com 64 CPUs, o número pode variar de 0 a 63.

  + Uma faixa é dada na forma *`M`* − *`N`*, onde *`M`* é menor ou igual a *`N`* e ambos os números estão no intervalo de CPU.

  + Se um número de CPU for um inteiro fora do intervalo permitido ou não for um inteiro, ocorrerá um erro.

Exemplos de especificadores `VCPU` (todos são equivalentes):

```
VCPU = 0,1,2,3,9,10
VCPU = 0-3,9-10
VCPU = 9,10,0-3
VCPU = 0,10,1,9,3,2
```

O atributo `THREAD_PRIORITY` indica a prioridade para os threads atribuídos ao grupo:

* Se `THREAD_PRIORITY` não for fornecido, a prioridade padrão é 0.

* Se `THREAD_PRIORITY` for fornecido, o valor do atributo deve estar no intervalo de -20 (maior prioridade) a 19 (menor prioridade). A prioridade para grupos de recursos de sistema deve estar no intervalo de -20 a 0. A prioridade para grupos de recursos de usuário deve estar no intervalo de 0 a 19. O uso de diferentes intervalos para grupos de sistema e de usuário garante que os threads de usuário nunca tenham uma prioridade maior que os threads de sistema.

`ENABLE` e `DISABLE` especificam que o grupo de recursos está inicialmente habilitado ou desabilitado. Se nenhum dos dois for especificado, o grupo é habilitado por padrão. Um grupo desabilitado não pode ter threads atribuídas a ele.

Exemplos:

* Crie um grupo de usuário habilitado que tenha uma única CPU e a menor prioridade:

  ```
  CREATE RESOURCE GROUP rg1
    TYPE = USER
    VCPU = 0
    THREAD_PRIORITY = 19;
  ```

* Crie um grupo de sistema desabilitado que não tenha afinidade de CPU (pode usar todas as CPUs) e a maior prioridade:

  ```
  CREATE RESOURCE GROUP rg2
    TYPE = SYSTEM
    THREAD_PRIORITY = -20
    DISABLE;
  ```

A gestão de grupos de recursos é local para o servidor em que ocorre. As instruções `CREATE RESOURCE GROUP` não são escritas no log binário e não são replicadas.