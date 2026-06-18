#### 20.8.3.1 Considerações sobre a Atualização Online

Ao atualizar um grupo online, você deve considerar os seguintes pontos:

- Independentemente da forma como você atualiza seu grupo, é importante desativar quaisquer escritas para os membros do grupo até que estejam prontos para se juntar novamente ao grupo.

- Quando um membro é parado, a variável `super_read_only` é definida como ativada automaticamente, mas essa alteração não é persistente.

- Quando o MySQL 5.7.22 ou o MySQL 8.0.11 tenta se juntar a um grupo que está rodando o MySQL 5.7.21 ou versões anteriores, ele não consegue se juntar ao grupo porque o MySQL 5.7.21 não envia seu valor de `lower_case_table_names`.
