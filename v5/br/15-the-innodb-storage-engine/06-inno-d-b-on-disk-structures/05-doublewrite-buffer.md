### 14.6.5 Buffer de escrita dupla

O buffer de escrita dupla é uma área de armazenamento onde o `InnoDB` escreve páginas descarregadas do pool de buffers antes de escrever as páginas em suas posições corretas nos arquivos de dados do `InnoDB`. Se houver um sistema operacional, subsistema de armazenamento ou saída inesperada do processo `mysqld` durante a escrita de uma página, o `InnoDB` pode encontrar uma boa cópia da página do buffer de escrita dupla durante a recuperação em caso de falha.

Embora os dados sejam escritos duas vezes, o buffer de escrita dupla não requer o dobro do overhead de E/S ou o dobro de operações de E/S. Os dados são escritos no buffer de escrita dupla em um grande bloco sequencial, com uma única chamada `fsync()` ao sistema operacional (exceto no caso em que `innodb_flush_method` está definido como `O_DIRECT_NO_FSYNC`).

O buffer de escrita dupla está habilitado por padrão na maioria dos casos. Para desabilitar o buffer de escrita dupla, defina `innodb_doublewrite` para 0.

Se os arquivos de espaço de tabela do sistema (“arquivos ibdata”) estiverem localizados em dispositivos Fusion-io que suportam escritas atômicas, o buffer de escrita dupla será desativado automaticamente e as escritas atômicas do Fusion-io serão usadas para todos os arquivos de dados. Como o ajuste do buffer de escrita dupla é global, o buffer de escrita dupla também será desativado para arquivos de dados que estejam em hardware não Fusion-io. Esse recurso é suportado apenas em hardware Fusion-io e só está habilitado para o Fusion-io NVMFS no Linux. Para aproveitar ao máximo esse recurso, é recomendado o ajuste `innodb_flush_method` de `O_DIRECT`.
