### 27.3.11 Limitações e restrições de programas armazenados em JavaScript

Os programas armazenados em JavaScript do MySQL estão sujeitos às limitações e restrições descritas nesta seção.

O objeto `Global` e a propriedade do objeto `globalThis` são suportados, mas seu escopo é limitado ao da rotina atual. Por exemplo, se um programa JavaScript específico define `globalThis.myProp = 10`, isso não está disponível para outros programas JavaScript, mesmo dentro da mesma sessão, e acessar `globalThis.myProp` em chamadas subsequentes do mesmo programa JavaScript não resulta no mesmo valor.

Uma variável JavaScript, local ou global, definida em um programa armazenado não é acessível a partir de qualquer outra conexão executando o mesmo programa.

Nem o acesso a arquivos nem o acesso à rede a partir do código de programas armazenados em JavaScript são suportados. Os programas armazenados em JavaScript do MySQL não preveem o uso de módulos de terceiros; por essa razão, a instrução `import` não é suportada. Além disso, não há suporte para Node.js.

O componente MLE usa um modelo de execução de um único fio (um fio por consulta). Isso significa que todas as funcionalidades assíncronas, como o objeto `Promise` em JavaScript e as funções `async`, são simuladas e podem exibir comportamento não determinístico. As promessas que não são aguardadas não são processadas até o final da execução do programa armazenado, o que significa que elas não conseguem impactar os valores dos argumentos de retorno em funções armazenadas ou os de argumentos de saída em procedimentos armazenados.

Assim como as rotinas armazenadas em SQL, as rotinas armazenadas em JavaScript com um número variável de argumentos não são suportadas; cada argumento e seu tipo devem ser especificados no momento da criação. As funções JavaScript dentro das rotinas podem ter um número variável de argumentos.

É possível chamar outros programas armazenados no corpo do programa armazenado em JavaScript e invocar um programa armazenado em JavaScript dentro de programas armazenados em SQL, incluindo procedimentos armazenados, funções armazenadas, eventos e gatilhos, conforme mostrado em outro lugar (veja a Seção 27.3.12, “Exemplos de Programas Armazenados em JavaScript”). Os programas armazenados em JavaScript também podem se chamar recursivamente; é possível chamar uma função ou método puro em JavaScript recursivamente dentro de um programa armazenado em JavaScript, conforme mostrado aqui:

```
mysql> CREATE FUNCTION recursive_sum(my_num INT)
    ->   RETURNS INT NO SQL LANGUAGE JAVASCRIPT AS
    -> $$
    $>   function sum(n) {
    $>     if(n <= 1) return n
    $>     else return n + sum(--n)
    $>   }
    $>
    $>   let x = sum(my_num)
    $>   return x
    $> $$
    -> ;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT recursive_sum(1), recursive_sum(2),
    ->        recursive_sum(20), recursive_sum(100)\G
*************************** 1. row ***************************
  recursive_sum(1): 1
  recursive_sum(2): 3
 recursive_sum(20): 210
recursive_sum(100): 5050
1 row in set (0.00 sec)
```

A profundidade de recursão é limitada a 1000. A recursão excessiva pode fazer com que um programa falhe, como este:

```
mysql> SELECT recursive_sum(1000);
ERROR 6113 (HY000): JavaScript> Maximum frame limit of 1000 exceeded. Frames on stack: 1001.
```

Os programas armazenados em JavaScript são suportados pelo MySQL Replication, sujeito à condição de que o componente MLE esteja instalado em todos os servidores da topologia. Para mais informações, consulte a Seção 19.5.1.18, “Replicação e Programas Armazenados em JavaScript”.