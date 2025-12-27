### 25.2.4 O que há de novo no MySQL NDB Cluster 9.5

As seções a seguir descrevem as mudanças na implementação do MySQL NDB Cluster na versão 9.5.0 do NDB Cluster, em comparação com as versões anteriores. O NDB Cluster 9.5 está disponível como uma versão de desenvolvimento para visualização e teste de novos recursos atualmente em desenvolvimento. Para produção, use o NDB 8.4; para mais informações, consulte MySQL NDB Cluster 8.4. O NDB Cluster 8.0 e 7.6 são versões GA anteriores que ainda são suportadas em produção, embora recomendação seja que novas implantações para uso em produção usem o MySQL NDB Cluster 8.4.

#### O que há de novo no NDB Cluster 9.5

As principais mudanças e novos recursos no NDB Cluster 9.5 que provavelmente serão de interesse estão listados aqui:

* **Suporte ao Ndb.cfg removido.** O uso de um arquivo de configuração `Ndb.cfg` no diretório de inicialização de um executável `NDB` foi desaconselhado no MySQL 9.1 e não é mais suportado a partir da versão 9.5.0 do NDB; tais arquivos não são mais lidos por nenhum executável do NDB Cluster.

Consulte a Seção 25.4.3.3, “Strings de Conexão do NDB Cluster”, para mais informações.

O MySQL Cluster Manager tem uma interface de linha de comando avançada que pode simplificar muitas tarefas complexas de gerenciamento do NDB Cluster. Consulte o Manual do Usuário do MySQL Cluster Manager 9.5.0, para mais informações.