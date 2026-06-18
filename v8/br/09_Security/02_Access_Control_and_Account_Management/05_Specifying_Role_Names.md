### 8.2.5 Especificação de nomes de papéis

Os nomes de papéis do MySQL referem-se a papéis, que são coleções de privilégios. Para exemplos de uso de papéis, consulte a Seção 8.2.10, “Usando papéis”.

Os nomes de funções têm sintaxe e semântica semelhantes aos nomes de contas; veja a Seção 8.2.4, “Especificando Nomes de Contas”. Como armazenados nas tabelas de concessão, eles têm as mesmas propriedades que os nomes de contas, que são descritas na Propriedades das Colunas do Escopo da Tabela de Concessão.

Os nomes dos papéis diferem dos nomes das contas nesses aspectos:

- A parte de usuário dos nomes de papéis não pode ficar em branco. Portanto, não existe um "papel anônimo" análogo ao conceito de "usuário anônimo".

- Quanto ao nome da conta, omitir a parte do host de um nome de papel resulta em uma parte do host de `'%'`. Mas, ao contrário de `'%'` em um nome de conta, uma parte do host de `'%'` em um nome de papel não tem propriedades com caracteres curinga. Por exemplo, para um nome `'me'@'%'` usado como nome de papel, a parte do host (`'%'`) é apenas um valor literal; não tem nenhuma propriedade de correspondência “qualquer host”.

- A notação de máscara de rede na parte do host de um nome de papel não tem importância.

- Um nome de conta pode ser `CURRENT_USER()` em vários contextos. Um nome de função não pode.

É possível que uma linha na tabela do sistema `mysql.user` sirva tanto como uma conta quanto um papel. Nesse caso, quaisquer propriedades de nome de usuário ou nome de host que correspondam não se aplicam em contextos para os quais o nome é usado como nome de papel. Por exemplo, você não pode executar a seguinte instrução com a expectativa de que ela defina os papéis da sessão atual usando todos os papéis que têm um usuário como parte de `myrole` e qualquer nome de host:

```
SET ROLE 'myrole'@'%';
```

Em vez disso, a declaração define o papel ativo para a sessão como o papel com exatamente o nome `'myrole'@'%'`.

Por essa razão, os nomes de funções são frequentemente especificados usando apenas a parte do nome do usuário e deixando a parte do nome do host implicitamente como `'%'`. Especificar uma função com uma parte de host que não seja `'%'` pode ser útil se você pretende criar um nome que funcione tanto como uma função quanto como uma conta de usuário que seja permitida para se conectar a partir do host fornecido.
