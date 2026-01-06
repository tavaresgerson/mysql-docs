#### 21.3.7.2 Atualização e Downgrade do NDB 7.6

Esta seção fornece informações sobre a compatibilidade entre diferentes versões do NDB Cluster 7.6 em relação à realização de atualizações e reduções, bem como matrizes de compatibilidade e notas. Informações adicionais também podem ser encontradas aqui sobre reduções do NDB 7.6 para séries anteriores de versões do NDB. Você já deve estar familiarizado com a instalação e configuração do NDB Cluster antes de tentar uma atualização ou redução. Consulte Seção 21.4, “Configuração do NDB Cluster”.

A tabela mostrada aqui fornece informações sobre a compatibilidade de atualização e downgrade do NDB Cluster entre diferentes versões do NDB 7.6. Notas adicionais sobre atualizações e downgrades para, a partir de ou dentro da série de versões do NDB Cluster 7.6 podem ser encontradas após a tabela.

**Figura 21.6 Compatibilidade de Atualização e Downgrade do NDB Cluster, MySQL NDB Cluster 7.6**

![Representação gráfica da matriz de atualização/desatualização contida no arquivo storage/ndb/src/common/util/version.cpp da árvore de código-fonte do NDB 7.6](images/mysql-cluster-upgrade-downgrade-7-6.png)

**Suporte às versões.** As seguintes versões do NDB Cluster são suportadas para atualizações para versões GA do NDB Cluster 7.6 (7.6.6 e versões posteriores):

- Lançamento do NDB Cluster 7.5 GA (7.5.4 e versões posteriores)
- Lançamento do NDB Cluster 7.4 GA (7.4.4 e versões posteriores)
- Lançamento do NDB Cluster 7.3 GA (7.3.2 e versões posteriores)

**Problemas Conhecidos Durante a Atualização ou Downgrade do NDB Cluster 7.6.** Os seguintes problemas são conhecidos para ocorrer durante a atualização para, downgrade do, ou entre as versões do NDB 7.6:

**Alterações no formato do arquivo de dados do disco.** Devido às alterações no formato do disco, a atualização para ou a atualização de qualquer uma das versões listadas aqui requer o reinício inicial do nó de cada nó de dados:

- NDB 7.6.2
- NDB 7.6.4

Para evitar problemas relacionados ao formato antigo, você deve recriar quaisquer espaços de tabela existentes e desfazer grupos de arquivos de log ao fazer a atualização. Você pode fazer isso realizando um reinício inicial de cada nó de dados (ou seja, usando a opção `--initial` como parte do processo de atualização).

Se você estiver usando tabelas de Dados de disco, uma desativação de qualquer versão do NDB 7.6 para qualquer versão do NDB 7.5 ou anterior exige que você reinicie todos os nós de dados com `--initial` como parte do processo de desativação. Isso ocorre porque as séries de versões do NDB 7.5 e anteriores não conseguem ler o novo formato de arquivo de Dados de disco.

**O índice de memória muda.** Se você estiver desatualizando do NDB 7.6 para o NDB 7.5 (ou versões anteriores), você deve definir um valor explícito para `IndexMemory` no arquivo de configuração do cluster, se ainda não estiver presente. Isso ocorre porque o NDB 7.6 não usa esse parâmetro e o define como 0 por padrão, enquanto é necessário no NDB 7.5 e em versões anteriores, em que o cluster se recusa a iniciar com configuração inválida recebida do servidor de gerenciamento... se `IndexMemory` não for definido para um valor diferente de zero.

Importante

A atualização para o NDB 7.6 a partir de uma versão anterior ou a desatualização do NDB 7.6 para uma versão anterior requer a purga e a criação novamente do sistema de arquivos do nó de dados `NDB`, o que significa que cada nó de dados deve ser reiniciado usando a opção `--initial` (mysql-cluster-programs-ndbd.html#option\_ndbd\_initial) como parte do reinício contínuo ou do reinício do sistema normalmente necessário. (Iniciar um nó de dados sem sistema de arquivos já é equivalente a um reinício inicial; nesses casos, `--initial` é implícito e não é necessário. Isso não mudou em relação às versões anteriores do NDB Cluster.)

Quando esse reinício é realizado como parte de uma atualização para o NDB 7.6, todos os arquivos LCP existentes são verificados para a presença do arquivo LCP `Sysfile`, indicando que o sistema de arquivos do nó de dados existente foi escrito usando o NDB 7.6. Se tal sistema de arquivos de nó de dados existir, mas não contiver o `Sysfile`, e se quaisquer nós de dados forem reiniciados sem a opção `--initial`, o `NDB` faz com que o reinício falhe com uma mensagem de erro apropriada.

Você também deve estar ciente de que essa proteção não é possível ao fazer uma atualização para uma versão anterior à NDB 7.6 a partir da NDB 7.6.
