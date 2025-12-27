### 8.2.5 Especificando Nomes de Papéis

Os nomes de papéis do MySQL referem-se a papéis, que são coleções nomeadas de privilégios. Para exemplos de uso de papéis, consulte a Seção 8.2.10, “Usando Papéis”.

Os nomes de papéis têm sintaxe e semântica semelhantes às de nomes de contas; veja a Seção 8.2.4, “Especificando Nomes de Contas”. Como armazenados nas tabelas de concessão, eles têm as mesmas propriedades que os nomes de contas, que são descritas na Propriedades das Colunas do Alcance da Tabela de Concessão.

Os nomes de papéis diferem dos nomes de contas nesses aspectos:

* A parte do usuário dos nomes de papéis não pode ser em branco. Assim, não existe um “papel anônimo” análogo ao conceito de “usuário anônimo”.

* Quanto a um nome de conta, omitir a parte do host de um nome de papel resulta em uma parte do host de `'%'`. Mas, ao contrário de `'%'` em um nome de conta, uma parte do host de `'%'` em um nome de papel não tem propriedades de correspondência com qualquer host. Por exemplo, para um nome `'me'@'%'` usado como um nome de papel, a parte do host (`'%'`) é apenas um valor literal; ele não tem nenhuma propriedade de correspondência com “qualquer host”.

* A notação de máscara de rede na parte do host de um nome de papel não tem significado.

* Um nome de conta é permitido ser `CURRENT_USER()` em vários contextos. Um nome de papel não é.

É possível que uma linha na tabela de sistema `mysql.user` sirva tanto como uma conta quanto como um papel. Neste caso, quaisquer propriedades de nome de usuário ou host especiais não se aplicam em contextos para os quais o nome é usado como um nome de papel. Por exemplo, você não pode executar a seguinte declaração com a expectativa de que ela defina os papéis da sessão usando todos os papéis que têm uma parte do usuário de `myrole` e qualquer nome de host:

```
SET ROLE 'myrole'@'%';
```

Em vez disso, a declaração define o papel ativo para a sessão ao papel com exatamente o nome `'myrole'@'%'`.

Por essa razão, os nomes de funções são frequentemente especificados usando apenas a parte do nome do usuário e deixando a parte do nome do host implicitamente como `'%'`. Especificar uma função com uma parte do host que não seja `'%'` pode ser útil se você pretende criar um nome que funcione tanto como uma função quanto como uma conta de usuário que seja permitida para se conectar a partir do host fornecido.